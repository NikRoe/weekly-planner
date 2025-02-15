# Weekly Planner

## Overview

The Weekly Planner is a web application designed to help users organize their week efficiently. Users can add, edit, and remove tasks while categorizing them by weekdays. A dedicated Backlog column allows users to store todos that are not scheduled for the current week.

Todos can be easily moved between columns via drag-and-drop functionality.

## Features

- Add new todos and assign them to a specific weekday.
- Move todos between columns using drag and drop.
- Store unscheduled todos in a backlog.
- Edit and delete existing todos.
- Mark todos as done.
- Persist todos using a database.

## Tech Stack

- Next.js (TypeScript) – The framework used for development.
- dnd-kit – Enables drag-and-drop functionality.
- zod – Schema validation for safer data handling.
- swr – Data fetching and state management (with optimistic UI updates).
- prisma – Database ORM for managing stored todos.
- MongoDB – The database used for persisting todos.
