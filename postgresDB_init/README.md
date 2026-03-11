This README explains how to create a local postgres DB and create the correct schema for the portfolio webapp

## Create a postgres container
docker pull  postgres:15.17-alpine3.23

docker run --name postgres15alpine -e POSTGRES_PASSWORD=<secret> -d -p 5432:5432  postgres:15.17-alpine3.23

## Create the local postgres schema and upload the data

docker exec -i postgres15alpine psql -U postgres -d postgres < ./local-db-init.sql 

## Connect to the local postgres DB

docker exec -it postgres15alpine psql -U postgres

\l                  # list database
\c postgres;        # select a db
\dt;                # list tables in selected DB
\d table;           # get info about specific table
