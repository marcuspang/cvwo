package database

import (
	"cvwo/models"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect() {
	dsn, ok := os.LookupEnv("DATABASE_URL")
	if !ok {
		panic("database url could not be found")
	}

	// TODO remove on production
	connection, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		panic("could not connect to database")
	}

	DB = connection

	// setup tables in database
	if err := connection.AutoMigrate(&models.User{}, &models.List{}, &models.Task{}, &models.Label{}); err != nil {
		panic(err)
	}
}
