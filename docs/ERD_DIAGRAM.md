# Lingua ERD (Entity Relationship Diagram)

## Visual Diagram (Mermaid)

```mermaid
erDiagram
    AUTH_USERS ||--|| PROFILES : "has"
    PROFILES ||--o{ USER_WEAKNESSES : "tracks"
    UNITS ||--o{ LESSONS : "contains"
    LESSONS ||--o{ EXERCISES : "contains"
    GRAMMAR_RULES ||--o{ EXERCISES : "linked_to"
    GRAMMAR_RULES ||--o{ USER_WEAKNESSES : "identified_by"

    PROFILES {
        uuid id PK "FK → auth.users"
        text display_name
        int total_xp
        int current_streak
        text current_level "A1-C2"
        date last_active_date
        timestamp created_at
    }

    UNITS {
        uuid id PK
        text title
        text description
        text cefr_level
        int order_index
        bool is_published
    }

    LESSONS {
        uuid id PK
        uuid unit_id FK
        text title
        int order_index
        int xp_reward
    }

    EXERCISES {
        uuid id PK
        uuid lesson_id FK
        text type "multiple_choice | fill_blank | word_order"
        text question
        text correct_answer
        jsonb options
        int order_index
        uuid grammar_rule_id FK "nullable"
    }

    GRAMMAR_RULES {
        uuid id PK
        text title
        text category
        text explanation
        text example_correct
        text example_incorrect
        text cefr_level
    }

    USER_WEAKNESSES {
        uuid id PK
        uuid user_id FK
        uuid grammar_rule_id FK
        int error_count
        timestamp last_tested_at
    }
```

## Relationships

| From | To | Type | FK Column |
|------|----|------|-----------|
| `profiles` | `auth.users` | 1:1 | `profiles.id` |
| `lessons` | `units` | N:1 | `lessons.unit_id` |
| `exercises` | `lessons` | N:1 | `exercises.lesson_id` |
| `exercises` | `grammar_rules` | N:1 (nullable) | `exercises.grammar_rule_id` |
| `user_weaknesses` | `profiles` | N:1 | `user_weaknesses.user_id` |
| `user_weaknesses` | `grammar_rules` | N:1 | `user_weaknesses.grammar_rule_id` |

## CEFR Level Hierarchy

```
A1 (Beginner) → A2 (Elementary) → B1 (Intermediate) → B2 (Upper Intermediate) → C1 (Advanced) → C2 (Proficiency)
```

XP thresholds: A1=0, A2=200, B1=500, B2=1000, C1=2000, C2=4000
