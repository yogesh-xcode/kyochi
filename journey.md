# Kyochi User Journeys by Role

This document describes the practical end-to-end journey for each role in the Kyochi platform based on the current app workflow and rules.

## Shared Workflow Backbone

- Appointment lifecycle:
  - `waiting -> scheduled -> in_progress -> completed`
  - `waiting -> declined` (dead end)
- On appointment `completed`:
  - Billing row is auto-created.
  - Feedback row is auto-created with pending state.
  - Patient wellness score is recalculated.
- Billing and Feedback are independent records (no invoice link inside feedback).

---

## 1) Admin Journey

### Primary goal
Manage the full system across all branches.

### Typical journey
1. Admin logs in and lands on dashboard/global operations view.
2. Admin can register patients for any branch.
3. Admin can book appointments for any valid patient/therapist/therapy.
4. Appointment is created in `waiting` status.
5. Therapist accepts and moves it to `scheduled`.
6. Therapist starts session (`in_progress`) and completes session (`completed`).
7. System auto-creates billing + feedback records.
8. Admin reviews billing queue and marks invoices as paid when payment is received.
9. Admin monitors feedback completion and operational KPIs.
10. Admin can hard-delete patients when needed (with linked data cleanup flow).

### Admin permissions summary
- Patients:
  - Add: yes (all branches)
  - View: yes (all branches)
  - Edit: yes (all patients)
  - Delete: yes (hard delete)
- Appointments:
  - Add/view/edit/delete: yes (system-wide, subject to current status logic in app)
  - Print appointment details: yes
- Billing:
  - Full access (view/manage/mark paid)
- Feedback:
  - View access; therapist is primary role for filling/editing ratings.

---

## 2) Franchisee Journey

### Primary goal
Run operations for their own branch.

### Typical journey
1. Franchisee logs in and sees only own franchise scope.
2. Franchisee registers new patients for their branch.
3. Franchisee books appointments (initial status always `waiting`).
4. Therapist handles acceptance and execution of sessions.
5. On completion, billing + feedback records are auto-generated.
6. Franchisee tracks invoices and collection status for branch.
7. Franchisee monitors pending feedback and branch-level throughput.

### Franchisee permissions summary
- Patients:
  - Add: yes (own branch)
  - View: yes (own branch)
  - Edit: yes (own branch)
  - Delete: no
- Appointments:
  - Add/view/edit/delete within own branch (as allowed by workflow rules)
  - Print appointment details: yes
- Billing:
  - Access allowed (own branch)
- Feedback:
  - Can view branch-relevant feedback records.

---

## 3) Therapist Journey

### Primary goal
Handle assigned sessions and complete clinical workflow.

### Typical journey
1. Therapist logs in and opens **My Appointments**.
2. New bookings appear as `waiting`.
3. Therapist chooses:
  - Accept -> `scheduled`
  - Decline -> `declined` (flow ends)
4. For `scheduled` sessions:
  - Therapist can edit only date/time (other fields visible but locked).
  - Therapist can use print action for appointment details.
5. At session start, therapist clicks **Start Session** -> `in_progress`.
6. At session end, therapist clicks **Complete** -> `completed`.
7. System auto-creates:
  - Billing (due)
  - Feedback (pending)
8. Therapist opens Feedback page and submits rating (1-5) for completed sessions.
9. Therapist can edit submitted feedback later, but cannot delete it.

### Therapist permissions summary
- Patients:
  - Add: yes (own branch)
  - View: own branch patients
  - Edit: only patients with at least one appointment tied to that therapist
  - Delete: no
- Appointments:
  - Accept/Decline in My Appointments
  - Start session and complete session
  - Edit constraints: only date/time, and only when status is `scheduled`
  - Print appointment details: yes
- Billing:
  - No billing page access/management
- Feedback:
  - Primary owner of feedback capture and updates
  - No delete action

---

## Status-Driven Operational View

- `waiting`
  - Created by booking (admin/franchisee/therapist)
  - Awaiting therapist decision
- `scheduled`
  - Accepted by therapist
  - Ready to start
- `in_progress`
  - Session currently running
- `completed`
  - Session done
  - Billing + feedback auto-created
  - Wellness score recalculated
- `declined`
  - Rejected by therapist
  - No billing/feedback generation

---

## End-to-End Example (Happy Path)

1. Franchisee books appointment for patient with therapist -> `waiting`.
2. Therapist accepts -> `scheduled`.
3. Therapist starts session -> `in_progress`.
4. Therapist completes -> `completed`.
5. System creates billing (due) and feedback (pending).
6. Therapist submits feedback rating.
7. Admin or franchisee marks invoice paid.
8. Patient visit cycle is operationally closed.
