-- DROP DATABASE "IOT";

CREATE DATABASE "IOT"
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'French_France.1252'
    LC_CTYPE = 'French_France.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;


-- Table #1


CREATE TABLE public.room
(
    "RoomId" character varying COLLATE pg_catalog."default" NOT NULL,
    "Count" integer NOT NULL DEFAULT 0,
    "MaxNumber" integer NOT NULL DEFAULT 20,
    "List" character varying[] COLLATE pg_catalog."default" NOT NULL DEFAULT '{"Please Wait"}'::character varying[],
    "Date" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT room_pkey PRIMARY KEY ("RoomId")
)

TABLESPACE pg_default;

ALTER TABLE public.room
    OWNER to postgres;


-- Table #2

CREATE TABLE public.roomlog
(
    roomid character varying COLLATE pg_catalog."default" NOT NULL,
    deviceid character varying COLLATE pg_catalog."default" NOT NULL,
    scandate timestamp with time zone NOT NULL,
    nameslist character varying[] COLLATE pg_catalog."default" NOT NULL,
    count integer NOT NULL DEFAULT 0,
    CONSTRAINT "logroomFK" FOREIGN KEY (roomid)
        REFERENCES public.room ("RoomId") MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public.roomlog
    OWNER to postgres;