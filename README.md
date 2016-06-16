# ical-wdc

A web data connector to use calendars as a datasource in Tableau

## tl;dr

> npm install && npm run proxy
> point wdc at http://localhost:8080
> prefix ics feed url with http://localhost:8080/ to proxy through xcors-anywhere

## Security Warning

If you use the cors-anywhere proxy and your connection to your ics stream is https,
the communication between tableau and the cors-anywhere proxy will not be encrypted.
