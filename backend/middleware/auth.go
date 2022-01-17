package middleware

import (
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2"
	jwtware "github.com/gofiber/jwt/v2"
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

func JWTProtected() func(*fiber.Ctx) error {
	// Create config for JWT authentication middleware.
	return jwtware.New(jwtware.Config{
		SigningKey:   []byte(os.Getenv("SECRET")),
		ContextKey:   "jwt", // used in private routes
		ErrorHandler: jwtError,
	})
}

func jwtError(c *fiber.Ctx, err error) error {
	// Return status 401 and failed authentication error.
	if err.Error() == "Missing or malformed JWT" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	// Return status 401 and failed authentication error.
	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"error": true,
		"msg":   err.Error(),
	})
}
