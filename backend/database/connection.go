package database

import (
	"cvwo/models"
	"flag"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect() {
	dsn, ok := os.LookupEnv("DB_URL")
	if !ok {
		panic("database url could not be found")
	}

	var config gorm.Config
	if !flag.Lookup("prod").Value.(flag.Getter).Get().(bool) {
		config = gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		}
	}

	connection, err := gorm.Open(postgres.Open(dsn), &config)

	if err != nil {
		panic("could not connect to database")
	}

	DB = connection

	// setup tables in database
	if err := connection.AutoMigrate(&models.User{}, &models.List{}, &models.Task{}, &models.Label{}); err != nil {
		panic(err)
	}
}
