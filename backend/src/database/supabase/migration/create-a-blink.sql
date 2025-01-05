create table blinks (
    id text primary key,
    title text not null,
    description text not null,
    imageUrl text,
    price numeric not null,
    donation numeric not null,
    links text[],
    createdAt timestamp not null,
    updatedAt timestamp not null
  );
  