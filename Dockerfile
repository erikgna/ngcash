FROM postgres:14
ENV POSTGRES_USER root
ENV POSTGRES_PASSWORD erik2202
ENV POSTGRES_DB ngcash
ADD init.sql /docker-entrypoint-initdb.d/
