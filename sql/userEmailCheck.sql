alter table users
add constraint user_email_check
check (
    email ~* '^.+@djibinho.com$')