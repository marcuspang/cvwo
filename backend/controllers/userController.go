package controllers

import (
	"cvwo/database"
	"cvwo/models"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	// generate bcrypt hash of the password
	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)

	// create user object to store in database
	user := models.User{
		Username: data["username"],
		Email:    data["email"],
		Password: password,
	}
	database.DB.Create(&user)

	// if Email already exists, user will have id of 0
	if user.Id == 0 {
		return c.JSON(fiber.Map{
			"message": "email already exists",
		})
	}

	return c.JSON(user)
}

func Login(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	// retrieve user object using email
	var user models.User
	database.DB.Where("email = ?", data["email"]).First(&user)

	// if user does not exist, user will haev Id of 0
	if user.Id == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "user not found",
		})
	}

	// compares hashed password with password given
	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"])); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "incorrect password",
		})
	}

	// create token with Issuer as user.Id and expiry in one day
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    strconv.Itoa(int(user.Id)),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)), // +1 day
	})

	// check if SECRET exists
	secret, ok := os.LookupEnv("SECRET")
	if !ok {
		log.Fatalf("secret not declared")
	}

	// sign token with secret
	signedToken, err := token.SignedString([]byte(secret))
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not login",
		})
	}

	// create cookie to store in frontend
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    signedToken,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

// get current user
func User(c *fiber.Ctx) error {
	// retrieve cookie
	cookie := c.Cookies("jwt")

	// check if SECRET exists
	secret, ok := os.LookupEnv("SECRET")
	if !ok {
		log.Fatalf("secret not declared")
	}

	// get token with secret key
	token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	// retrieve Issuer in claims by asserting that the
	// RegisteredClaims interface implements token.Claims
	claims := token.Claims.(*jwt.RegisteredClaims)

	var user models.User

	database.DB.Where("id = ?", claims.Issuer).First(&user)

	return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {
	// "delete" the cookie by setting the expiry to the past
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Date(2009, time.November, 10, 23, 0, 0, 0, time.UTC),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}
