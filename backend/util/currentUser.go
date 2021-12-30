package util

import (
	"log"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

// if user is logged in, user.Id will be returned, else return an Unauthorized error
func CurrentUserId(c *fiber.Ctx) (uint, fiber.Map) {
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
		return 0, fiber.Map{
			"message": "unauthenticated",
		}
	}

	// retrieve Issuer in claims by asserting that the
	// RegisteredClaims interface implements token.Claims
	issuer := token.Claims.(*jwt.RegisteredClaims).Issuer

	userId, err := strconv.Atoi(issuer)
	if err != nil {
		panic("invalid issuer")
	}

	return uint(userId), nil
}
