package controllers

import (
	"cvwo/database"
	"cvwo/models"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

type RegisterBody struct {
	Username string `json:"username" xml:"username" form:"username"`
	LoginBody
}

type LoginBody struct {
	Email    string `json:"email" xml:"email" form:"email"`
	Password string `json:"password" xml:"password" form:"password"`
}

type UpdateBody struct {
	Username string `json:"username" xml:"username" form:"username"`
	Email    string `json:"email" xml:"email" form:"email"`
}

func Register(c *fiber.Ctx) error {
	var body RegisterBody
	if err := c.BodyParser(&body); err != nil {
		return err
	}

	// generate bcrypt hash of the password
	password, _ := bcrypt.GenerateFromPassword([]byte(body.Password), 14)

	// create user object to store in database
	user := models.User{
		Username: body.Username,
		Email:    body.Email,
		Password: password,
	}

	fmt.Println("register:", password)

	// return any error in creation of user
	if err := database.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.JSON(user)
}

func Login(c *fiber.Ctx) error {
	var body LoginBody
	if err := c.BodyParser(&body); err != nil {
		return err
	}

	// retrieve user object using email
	var user models.User
	if err := database.DB.Where("email = ?", body.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "user not found",
		})
	}

	// compares hashed password with password given
	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(body.Password)); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
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
		panic("secret not declared")
	}

	// sign token with secret
	signedToken, err := token.SignedString([]byte(secret))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "could not login",
		})
	}

	// create cookie to store in frontend
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    signedToken,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
		Domain:   "localhost",
	}

	c.Cookie(&cookie)
	return c.JSON(fiber.Map{
		"message": "success",
		"data":    signedToken,
	})
}

// get current user
func Current(c *fiber.Ctx) error {
	userId := c.Locals("userId")

	// find user in database using id
	var user models.User
	if err := database.DB.Find(&user, userId).Error; err != nil || user.Id == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "user not found",
		})
	}
	return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {
	// "delete" the cookie by setting the expiry to the past
	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Date(2009, time.November, 10, 23, 0, 0, 0, time.UTC),
		HTTPOnly: true,
	})

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func GetUser(c *fiber.Ctx) error {
	id := c.Params("id")
	var user models.User
	if err := database.DB.Find(&user, id).Error; err != nil || user.Id == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "user not found",
		})
	}

	return c.JSON(user)
}

func UpdateUser(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bad input params",
		})
	}

	if userId != uint(id) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "unauthorized to modify user data",
		})
	}
	var body UpdateBody
	if err := c.BodyParser(&body); err != nil {
		return err
	}

	var user models.User
	database.DB.First(&user, userId)
	if body.Username != "" {
		user.Username = body.Username
	}
	if body.Email != "" {
		user.Email = body.Email
	}

	if err := database.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error updating user",
		})
	}
	return c.JSON(user)
}

func DeleteUser(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bad input params",
		})
	}

	if userId != uint(id) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "unauthorized to modify user data",
		})
	}

	user := &models.User{Id: userId}

	if err := database.DB.Model(&user).Association("Lists").Clear(); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error deleting associations",
		})
	}
	if err := database.DB.Delete(&user).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error deleting user",
		})
	}
	return c.JSON(fiber.Map{
		"message": "success",
	})
}
