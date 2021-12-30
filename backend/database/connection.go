package database

import (
	"cvwo/models"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn, ok := os.LookupEnv("DATABASE_URL")
	if !ok {
		panic("database url could not be found")
	}

	connection, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("could not connect to database")
	}

	DB = connection

	// setup tables in database
	connection.AutoMigrate(&models.User{}, &models.List{}, &models.Task{}, &models.Label{})
}
