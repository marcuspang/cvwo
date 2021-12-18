package store

import (
	"cvwo/backend/internal/database"
	"database/sql"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
)

var db *bun.DB

func SetDBConnection() {
	pgDatabase := sql.OpenDB(database.GetDBConnector())

	db = bun.NewDB(pgDatabase, pgdialect.New())
}

func GetDBConnection() *bun.DB {
	return db
}
