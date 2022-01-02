package controllers

import (
	"cvwo/database"
	"cvwo/models"

	"github.com/gofiber/fiber/v2"
)

type ArchiveBody struct {
	Archive bool `json:"archive" xml:"archive" form:"archive"`
}

type AddListBody struct {
	Title string `json:"title" xml:"title" form:"title"`
}

// fields will be left empty if no update to that field
type UpdateListBody struct {
	Id    int    `json:"id" xml:"id" form:"id"`
	Title string `json:"title" xml:"title" form:"title"`
	Tasks []int  `json:"tasks" xml:"tasks" form:"tasks"` // list of task ids
	Users []int  `json:"users" xml:"users" form:"users"` // list of user ids
}

// get lists that the current user has access to
func GetLists(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)
	var lists []models.List

	// preload to get users and lists in one query
	if err := database.DB.Preload("Users").Preload("Tasks").Model(&models.User{Id: userId}).Association("Lists").Find(&lists); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "lists not found",
		})
	}
	return c.JSON(lists)
}

func AddList(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)

	var body AddListBody
	if err := c.BodyParser(&body); err != nil {
		return err
	}

	// store user information into user then create list
	var user models.User
	if err := database.DB.First(&user, userId).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "user not found",
		})
	}

	list := models.List{
		Title:    body.Title,
		Archived: false,
		Tasks:    nil,
		Users:    []models.User{user},
	}

	if err := database.DB.Create(&list).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}
	return c.JSON(list)
}

func ArchiveList(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)
	listId, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bad input params",
		})
	}

	var body ArchiveBody
	if err := c.BodyParser(&body); err != nil {
		return err
	}

	list := models.List{
		Id: uint(listId),
	}

	// find users who have access to list
	if err := database.DB.Model(&list).Association("Users").Find(&models.User{Id: userId}); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding users in list",
		})
	}

	list.Archived = body.Archive
	if err := database.DB.Save(&list).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error archiving/unarchiving list",
		})
	}
	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func DeleteList(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)
	listId, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bad input params",
		})
	}

	user := models.User{Id: userId}
	list := models.List{Id: uint(listId)}

	// find users who have access to list
	if err := database.DB.Model(&list).Association("Users").Find(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding users in list",
		})
	}

	// remove association
	if err := database.DB.Model(&user).Association("Lists").Delete(&list); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error deleting association with user",
		})
	}
	// delete from database
	if err := database.DB.Delete(&list); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error deleting list",
		})
	}
	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func UpdateList(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)
	listId, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bad input params",
		})
	}

	var body UpdateListBody
	if err := c.BodyParser(body); err != nil {
		return err
	}

	list := models.List{
		Id: uint(listId),
	}

	// find users who have access to list
	if err := database.DB.Model(&list).Association("Users").Find(&models.User{Id: userId}); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding users in list",
		})
	}

	// once user is in the list, find list object and update each
	// field accordingly
	database.DB.First(&list)
	if body.Title != "" {
		list.Title = body.Title
	}
	if len(body.Tasks) > 0 {
		var tasks []models.Task

		database.DB.Where("id IN ?", body.Tasks).Find(&tasks)
		list.Tasks = tasks
	}
	if len(body.Users) > 0 {
		var users []models.User

		database.DB.Where("id IN ?", body.Users).Find(&users)
		list.Users = users
	}
	// if update transaction has error, return it
	if err := database.DB.Save(&list).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}
	// success
	return c.JSON(fiber.Map{
		"message": "success",
	})
}
