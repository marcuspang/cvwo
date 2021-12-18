package database

import (
	"net"
	"os"

	"github.com/joho/godotenv"
	"github.com/uptrace/bun/driver/pgdriver"
)

func GetDBConnector() *pgdriver.Connector {
	// load env files
	err := godotenv.Load()
	if err != nil {
		panic("error loading .env file")
	}

	// return connector of database options
	return pgdriver.NewConnector(
		pgdriver.WithAddr(net.JoinHostPort(os.Getenv("PGHOST"), os.Getenv("PGPORT"))),
		pgdriver.WithUser(os.Getenv("PGUSER")),
		pgdriver.WithPassword(os.Getenv("PGPASSWORD")),
		pgdriver.WithDatabase(os.Getenv("PGDATABASE")),
	)
}
