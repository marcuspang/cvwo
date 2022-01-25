package middleware

import (
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

// check if request has cookies and saves userId into c.Locals
func Protected(c *fiber.Ctx) error {
	// retrieve cookie
	cookie := c.Cookies("jwt")

	// check if SECRET exists
	secret, _ := os.LookupEnv("SECRET")

	// get token with secret key
	token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	// retrieve Issuer in claims by asserting that the
	// RegisteredClaims interface implements token.Claims
	issuer := token.Claims.(*jwt.RegisteredClaims).Issuer

	userId, err := strconv.Atoi(issuer)
	if err != nil || userId == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "invalid issuer",
		})
	}

	c.Locals("userId", uint(userId))

	return c.Next()
}
