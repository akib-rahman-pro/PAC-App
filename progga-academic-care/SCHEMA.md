# Progga Academic Care - Backend Schema & Logic Design

## 1. User Roles & Hierarchy (RBAC)

The system uses a strict Role-Based Access Control (RBAC) system.

| Role | System ID | Permissions Summary |
| :--- | :--- | :--- |
| **Super Moderator** | `admin` | **Full Access**. Manage users, assign roles, view all data, override bans. |
| **Moderator** | `moderator` | **User Mgmt**. Approve/Ban users, create groups, spy on chats (read-only). |
| **Teacher** | `teacher` | **Academic**. Post to feeds/groups, input marks/attendance. **NO** payment access. |
| **Cashier** | `cashier` | **Financial**. Input/View payments. **NO** academic/chat access. |
| **Student** | `student` | **User**. View assigned group/global feed, chat, view own progress. |
| **Guardian** | `guardian` | **Observer**. View linked student's progress & payments. Read-only. |

---

## 2. Database Schema (Firestore / NoSQL Structure)

### Collection: `users`
Stores profile and role information.
```json
{
  "uid": "string (Auth ID)",
  "phoneNumber": "string (Unique)",
  "name": "string", // নাম
  "role": "student" | "guardian" | "management", // পদবী
  "status": "pending" | "approved" | "banned", // Approval Status
  
  // Student Specific Fields
  "schoolName": "string", // স্কুলের নাম
  "classGrade": "string", // ক্লাস
  "schoolRoll": "string", // স্কুলের রোল
  "coachingRoll": "string (Unique, Assigned by Admin)", // কোচিং রোল (System ID)

  // Guardian Specific Fields
  "linkedCoachingRoll": "string", // Student's Coaching Roll to link

  "profileImage": "url",
  "assignedClassGroups": ["groupId1", "groupId2"]
}
```

### Collection: `class_groups`
Manages isolated classrooms.
```json
{
  "groupId": "string",
  "name": "string (e.g., Class 10 - Batch A)",
  "createdBy": "uid (Moderator)",
  "teacherIds": ["uid"],
  "studentIds": ["uid"]
}
```

### Collection: `posts`
Social feed content.
```json
{
  "postId": "string",
  "authorId": "uid",
  "type": "global" | "class_group",
  "targetGroupId": "string (null if global)",
  "content": "string",
  "mediaUrls": ["url"],
  "timestamp": "timestamp",
  "isEncrypted": true // Content protection flag
}
```

### Collection: `chats`
Private and group messaging.
```json
{
  "chatId": "string",
  "type": "private" | "group",
  "participantIds": ["uid1", "uid2"],
  "lastMessage": "string",
  "updatedAt": "timestamp"
}
```
#### Sub-collection: `chats/{chatId}/messages`
```json
{
  "messageId": "string",
  "senderId": "uid",
  "content": "string",
  "timestamp": "timestamp",
  "readBy": ["uid"]
}
```

### Collection: `academic_records`
Stores exam results and attendance.
```json
{
  "recordId": "string",
  "studentId": "uid",
  "type": "exam" | "attendance",
  "date": "timestamp",
  // If Exam
  "examTitle": "string",
  "subject": "string",
  "marksObtained": number,
  "totalMarks": number,
  // If Attendance
  "status": "present" | "absent" | "late"
}
```

### Collection: `payments`
Offline payment ledger.
```json
{
  "paymentId": "string",
  "studentId": "uid",
  "amount": number,
  "month": "string (e.g., Jan 2024)",
  "type": "tuition" | "exam_fee" | "other",
  "status": "paid" | "due",
  "recordedBy": "uid (Cashier/Admin)",
  "timestamp": "timestamp"
}
```

---

## 3. Backend Logic & Security Rules

### A. Registration Flow (Approval System)
1.  **User Signs Up:** Account created in Auth, document added to `users` with `status: 'pending'`.
2.  **Middleware Check:** All API requests check `users/{uid}.status == 'approved'`. If not, return `403 Forbidden`.
3.  **Approval:** Only `admin` or `moderator` can update `status` to `'approved'`.

### B. Class Group Isolation
*   **Query Rule:** When fetching posts/resources:
    *   If `role == student`: Query where `targetGroupId` IN `user.assignedClassGroups` OR `type == 'global'`.
    *   If `role == teacher`: Query where `targetGroupId` IN `user.assignedClassGroups` OR `type == 'global'`.
    *   If `role == admin/moderator`: View All.

### C. Spy/Monitoring System
*   **Logic:**
    *   Endpoint: `GET /api/admin/spy/{targetStudentId}`
    *   Permission: `role` must be `admin` or `moderator`.
    *   Action: Query `chats` where `participantIds` contains `targetStudentId`.
    *   **Privacy Note:** This bypasses standard privacy rules. Access should be logged in an `audit_logs` collection for accountability.

### D. DRM & Content Protection (Web/App)
*   **Screenshot Prevention:**
    *   *Mobile (Flutter):* Use `flutter_windowmanager` to set `FLAG_SECURE`.
    *   *Web:* Listen to `keyup` (PrintScreen) and clear clipboard. Use CSS `user-select: none`. (Note: Web DRM is not absolute).
*   **Secure Downloads:**
    *   Files are stored in a private bucket.
    *   Files are served via **Signed URLs** with short expiration (e.g., 5 minutes).
    *   Frontend renders PDF in a custom canvas/viewer that disables the browser's native download button.

### E. Payment Ledger Visibility
*   **Read Access:**
    *   `admin`, `moderator`, `cashier`: All records.
    *   `student`, `guardian`: Only records where `studentId == user.uid` (or linked ID).
    *   `teacher`: **DENIED**.

---

## 4. Frontend Implementation Guide (Flutter/React)

### State Management
*   Store `currentUser` object globally upon login.
*   Compute `permissions` derived from `currentUser.role`.

### Navigation (Role-Based)
*   **Sidebar/Drawer:**
    *   `Dashboard`: All
    *   `Global Feed`: All
    *   `My Classes`: Student/Teacher
    *   `Students Progress`: Teacher/Guardian
    *   `Payment Entry`: Cashier Only
    *   `Moderation Panel`: Admin/Mod Only

### Graph Rendering
*   Use `fl_chart` (Flutter) or `recharts` (React).
*   **Data Prep:** Fetch `academic_records` -> Filter by `studentId` -> Group by `subject` -> Map to `(date, marks)`.
