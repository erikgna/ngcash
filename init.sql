create table accounts(
	id SERIAL primary key,
	balance numeric default 100 not null 
);

create table users(
	id SERIAL primary key,
	username text not null unique,
	password text not null,
	accountId SERIAL,
	CONSTRAINT fk_account
      FOREIGN KEY(accountId) 
	  REFERENCES accounts(id)
);

alter table users
  add constraint check_min_length check (length(username) > 3);

create table transactions(
	id SERIAL primary key,
	debitedAccountId serial not null,
	creditedAccountId serial not null,
	value numeric not null,
	createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP not null,
	CONSTRAINT fk_debitedAccountId
      FOREIGN KEY(debitedAccountId) 
	  REFERENCES accounts(id),
	  CONSTRAINT fk_creditedAccountId
      FOREIGN KEY(creditedAccountId) 
	  REFERENCES accounts(id)
);
