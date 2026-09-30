# PRD-07 — File

> ## Partial lift for Chat attachments (v1.0.4 — 29 Sep 2026, D48)
>
> The lift criterion "Chat (PRD-14) ships and needs attachments" is met by PO decision D48. **Only message attachments in Chat** leave the hold; task attachments, the central file list and quotas stay on hold (D22).
>
> - **Source entity:** a chat message. A file is visible exactly when its message is (conversation access); it goes when the message is deleted (rule 2 below), including deletion by a moderator.
> - **Limits** [H]: ≤ 10 files per message, ≤ 25 MB per file (rule 3); allowlist: images (PNG, JPEG, GIF, WebP), video (MP4, WebM, MOV), documents (PDF, Office, CSV, TXT, ZIP). Higher video limit is PRD-14 Q7.
> - **Malware scanning before other members can download** (rule 3) and statuses *uploading → scanning → ready / failed*; not-ready files are private to the uploader (F1).
> - Link previews reuse storage for their image (`link_previews.image_file_id`, TECH-01 v1.5 F18).
> - Before build this module still upgrades to template v1.1; PRD-14 v1.5 C2 is the binding UX until then.

> ## ⏸ ON HOLD (v1.0.3 — 27 Sep 2026, decision D22) — *partially lifted for Chat attachments by v1.0.4 above*
>
> **PO decision: the File module is on hold.** It is removed from the navigation (rail and Panduan) and from the release 2 candidate list (PRD-00 v1.2.6 §9). Nothing below is planned until the hold is lifted.
>
> - **What stays:** avatars, organization logos and **uploaded space icons** (PRD-06 v2.0 §6.9) use object storage directly (Vercel Blob), not this module. `.md` import into Doc (PRD-08 E5) reads the file client-side and stores the doc, not a File record.
> - **What waits:** task attachments, a central file list, quotas and malware scanning. Task detail shows no "Lampiran" section while on hold.
> - **Lift criteria (proposed):** ≥ 3 pilot organizations name attachments among their top-3 reasons to keep other tools, or Chat (PRD-14) ships and needs attachments. Re-estimate and upgrade to template v1.1 before planning.
> - Lead as a file source is void (C-16).

> **Amendment 25 Sep 2026 — Space → Project:** the app's display name is now **Project** and its URLs live under `/{slug}/projects/…`. The internal app id (`space`), event names (`space.*`), grants and tables are unchanged (PRD-06 §6.5). Text in this PRD was updated accordingly; no requirement changed.

> ## QA amendment (v1.0.2 — 26 Sep 2026)
>
> - **F1 — Uploads in progress or failed are private (QA FL1).** A file whose status is not `ready` is visible only to its uploader (with "Coba lagi"); other members never see failed or partial uploads.
> - **F2 — Storage usage (QA FL2).** "Pemakaian organisasi: X dari {kuota}" counts all `ready` files of the organization and is the same for every member; lists still show only files the viewer can see.

> ## Release status & alignment addendum (v1.0.1 — 25 Sep 2026)
>
> **Release:** deferred to **release 2**, as **task attachments in Project** only (PRD-00 §3.3). The standalone File app is later. Avatars and organization logos in release 1 use object storage directly (PRD-02, PRD-12), not this module.
>
> **Before build:** upgrade to template v1.1. Until then, these rules are binding and **override any conflicting v1.0 text**:
>
> 1. **Ownership & access:** a file always has a source entity. There are **no sourceless uploads** in release 2. A file has no ACL of its own: it is visible exactly when its source is (PRD-04 §6.4).
> 2. **Retention (resolves the v1.0 "explicit retention policy" AC):** a file follows its source. When the source goes to trash, the file does too; when the source is purged, the file's object is deleted (PRD-13).
> 3. **Limits to decide before build** [Hypothesis]: ≤ 25 MB per file; an allowlist of types; malware scanning before other members can download; a per-organization quota, set with the Billing PRD.
> 4. **Storage:** object storage on Vercel (Vercel Blob [H]); signed, short-lived download URLs that are authorized per request.
> 5. **Events:** `file.file.uploaded` / `.deleted` per the PRD-00b catalog (delete is audited).

---

## 1. Problem

Agere applications create files in different contexts. Users need one
reliable place to find and manage those files without duplicating
ownership logic.

## 2. Goal

Provide a centralized file metadata and storage experience while
preserving source-application ownership.

## 3. Features

- Upload
- Upload progress
- Retry failed upload
- Search
- Filter
- Preview where supported
- Download
- Delete
- Metadata
- Source application
- Source entity
- Uploader
- Created date

## 4. Ownership model

``` text
Lead/Project/Doc
      │
      └── File
            ├── metadata
            └── storage object
```

File must retain source context.

## 5. Success metrics

- Upload success rate
- Download success rate
- File search success
- Failed-upload recovery rate

## 6. Acceptance criteria

**Given** a file upload fails, **When** the user retries, **Then** the
system resumes/restarts according to the upload strategy without
creating misleading duplicate records.

**Given** a file belongs to Organization A, **When** Organization B
requests it, **Then** metadata and content are inaccessible.

**Given** a source record is deleted, **When** its file references are
resolved, **Then** the system follows an explicit retention policy
rather than silently orphaning data.
