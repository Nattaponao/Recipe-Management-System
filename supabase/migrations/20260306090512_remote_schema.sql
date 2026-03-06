drop extension if exists "pg_net";

create sequence "public"."Post_id_seq";

create sequence "public"."User_id_seq";

create sequence "public"."featured_cards_id_seq";

create sequence "public"."popular_cards_id_seq";


  create table "public"."Post" (
    "id" integer not null default nextval('public."Post_id_seq"'::regclass),
    "title" text not null,
    "content" text,
    "published" boolean not null default false,
    "authorId" integer not null
      );



  create table "public"."User" (
    "id" integer not null default nextval('public."User_id_seq"'::regclass),
    "email" text not null,
    "name" text,
    "password_hashed" text,
    "role" text not null default 'USER'::text,
    "lastSeen" timestamp with time zone,
    "image" text
      );



  create table "public"."_prisma_migrations" (
    "id" character varying(36) not null,
    "checksum" character varying(64) not null,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) not null,
    "logs" text,
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone not null default now(),
    "applied_steps_count" integer not null default 0
      );



  create table "public"."ai_cache" (
    "id" uuid not null default gen_random_uuid(),
    "ingredients_key" text not null,
    "result_json" jsonb not null,
    "created_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP
      );



  create table "public"."featured_cards" (
    "id" integer not null default nextval('public.featured_cards_id_seq'::regclass),
    "slot" integer not null,
    "recipe_id" uuid not null,
    "profile_name" text,
    "profile_date" text,
    "profile_avatar" text,
    "updated_at" timestamp(3) without time zone not null
      );



  create table "public"."hero_settings" (
    "id" integer not null default 1,
    "title1" text not null default 'Pad Krapao'::text,
    "title2" text not null default 'Moo sub'::text,
    "tag1" text not null default 'How to'::text,
    "tag2" text not null default 'Baking'::text,
    "read_time" text not null default '12 min read'::text,
    "cta_text" text not null default 'READ NOW'::text,
    "right_image_url" text,
    "updated_at" timestamp(3) without time zone not null
      );



  create table "public"."popular_cards" (
    "id" integer not null default nextval('public.popular_cards_id_seq'::regclass),
    "slot" integer not null,
    "recipe_id" uuid not null,
    "updated_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP
      );



  create table "public"."recipe_ingredients" (
    "id" uuid not null default gen_random_uuid(),
    "recipe_id" uuid default gen_random_uuid(),
    "name" text,
    "amount" numeric,
    "unit" text,
    "sort_order" bigint
      );



  create table "public"."recipe_likes" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" integer not null,
    "recipe_id" uuid not null,
    "created_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP
      );



  create table "public"."recipe_saves" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" integer not null,
    "recipe_id" uuid not null,
    "created_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP
      );



  create table "public"."recipe_steps" (
    "id" uuid not null default gen_random_uuid(),
    "recipe_id" uuid default gen_random_uuid(),
    "step_no" bigint,
    "text" text
      );



  create table "public"."recipes" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "name" text default ''::text,
    "description" text,
    "cover_image" text,
    "category" text,
    "country" text,
    "tags" text,
    "author_id" integer
      );


alter sequence "public"."Post_id_seq" owned by "public"."Post"."id";

alter sequence "public"."User_id_seq" owned by "public"."User"."id";

alter sequence "public"."featured_cards_id_seq" owned by "public"."featured_cards"."id";

alter sequence "public"."popular_cards_id_seq" owned by "public"."popular_cards"."id";

CREATE UNIQUE INDEX "Post_pkey" ON public."Post" USING btree (id);

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);

CREATE UNIQUE INDEX "User_pkey" ON public."User" USING btree (id);

CREATE UNIQUE INDEX _prisma_migrations_pkey ON public._prisma_migrations USING btree (id);

CREATE UNIQUE INDEX ai_cache_ingredients_key_key ON public.ai_cache USING btree (ingredients_key);

CREATE UNIQUE INDEX ai_cache_pkey ON public.ai_cache USING btree (id);

CREATE UNIQUE INDEX featured_cards_pkey ON public.featured_cards USING btree (id);

CREATE UNIQUE INDEX featured_cards_slot_key ON public.featured_cards USING btree (slot);

CREATE UNIQUE INDEX hero_settings_pkey ON public.hero_settings USING btree (id);

CREATE UNIQUE INDEX popular_cards_pkey ON public.popular_cards USING btree (id);

CREATE UNIQUE INDEX popular_cards_slot_key ON public.popular_cards USING btree (slot);

CREATE UNIQUE INDEX recipe_ingredients_pkey ON public.recipe_ingredients USING btree (id);

CREATE UNIQUE INDEX recipe_likes_pkey ON public.recipe_likes USING btree (id);

CREATE UNIQUE INDEX recipe_likes_user_recipe_unique ON public.recipe_likes USING btree (user_id, recipe_id);

CREATE UNIQUE INDEX recipe_saves_pkey ON public.recipe_saves USING btree (id);

CREATE UNIQUE INDEX recipe_saves_user_recipe_unique ON public.recipe_saves USING btree (user_id, recipe_id);

CREATE UNIQUE INDEX recipe_steps_pkey ON public.recipe_steps USING btree (id);

CREATE UNIQUE INDEX recipes_pkey ON public.recipes USING btree (id);

alter table "public"."Post" add constraint "Post_pkey" PRIMARY KEY using index "Post_pkey";

alter table "public"."User" add constraint "User_pkey" PRIMARY KEY using index "User_pkey";

alter table "public"."_prisma_migrations" add constraint "_prisma_migrations_pkey" PRIMARY KEY using index "_prisma_migrations_pkey";

alter table "public"."ai_cache" add constraint "ai_cache_pkey" PRIMARY KEY using index "ai_cache_pkey";

alter table "public"."featured_cards" add constraint "featured_cards_pkey" PRIMARY KEY using index "featured_cards_pkey";

alter table "public"."hero_settings" add constraint "hero_settings_pkey" PRIMARY KEY using index "hero_settings_pkey";

alter table "public"."popular_cards" add constraint "popular_cards_pkey" PRIMARY KEY using index "popular_cards_pkey";

alter table "public"."recipe_ingredients" add constraint "recipe_ingredients_pkey" PRIMARY KEY using index "recipe_ingredients_pkey";

alter table "public"."recipe_likes" add constraint "recipe_likes_pkey" PRIMARY KEY using index "recipe_likes_pkey";

alter table "public"."recipe_saves" add constraint "recipe_saves_pkey" PRIMARY KEY using index "recipe_saves_pkey";

alter table "public"."recipe_steps" add constraint "recipe_steps_pkey" PRIMARY KEY using index "recipe_steps_pkey";

alter table "public"."recipes" add constraint "recipes_pkey" PRIMARY KEY using index "recipes_pkey";

alter table "public"."Post" add constraint "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Post" validate constraint "Post_authorId_fkey";

alter table "public"."featured_cards" add constraint "featured_cards_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."featured_cards" validate constraint "featured_cards_recipe_id_fkey";

alter table "public"."popular_cards" add constraint "popular_cards_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."popular_cards" validate constraint "popular_cards_recipe_id_fkey";

alter table "public"."recipe_ingredients" add constraint "recipe_ingredients_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."recipe_ingredients" validate constraint "recipe_ingredients_recipe_id_fkey";

alter table "public"."recipe_likes" add constraint "recipe_likes_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE not valid;

alter table "public"."recipe_likes" validate constraint "recipe_likes_recipe_id_fkey";

alter table "public"."recipe_likes" add constraint "recipe_likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON DELETE CASCADE not valid;

alter table "public"."recipe_likes" validate constraint "recipe_likes_user_id_fkey";

alter table "public"."recipe_saves" add constraint "recipe_saves_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE not valid;

alter table "public"."recipe_saves" validate constraint "recipe_saves_recipe_id_fkey";

alter table "public"."recipe_saves" add constraint "recipe_saves_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON DELETE CASCADE not valid;

alter table "public"."recipe_saves" validate constraint "recipe_saves_user_id_fkey";

alter table "public"."recipe_steps" add constraint "recipe_steps_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."recipe_steps" validate constraint "recipe_steps_recipe_id_fkey";

alter table "public"."recipes" add constraint "recipes_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."recipes" validate constraint "recipes_author_id_fkey";


