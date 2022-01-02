package controllers

import (
	"cvwo/database"
	"cvwo/models"

	"github.com/gofiber/fiber/v2"
)

type ArchiveParam struct {
	Archive bool `json:"archive" xml:"archive" form:"archive"`
}

type UnarchiveParam struct {
	Id int `json:"id" xml:"id" form:"id"`
}

type AddListParam struct {
	Title string `json:"title" xml:"title" form:"title"`
}

// fields will be left empty if no update to that field
type UpdateListParam struct {
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

	params := &AddListParam{}
	if err := c.BodyParser(&params); err != nil {
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
		Title:    params.Title,
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

	// check whether listId exists
	params := &ArchiveParam{}
	if err := c.BodyParser(params); err != nil {
		return err
	}

	var users []models.User
	list := models.List{
		Id: uint(listId),
	}

	// find users who have access to list
	if err := database.DB.Model(&list).Association("Users").Find(&users); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding users in list",
		})
	}

	// check if current user is in the list
	for _, user := range users {
		// if in the list, archive the list
		if user.Id == userId {
			// TODO figure out error handling here
			if params.Archive {
				database.DB.Model(&list).Update("archived", true)
			} else {
				database.DB.Model(&list).Update("archived", false)
			}
			return c.JSON(fiber.Map{
				"message": "success",
			})
		}
	}

	// else return error
	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"message": "unauthorized to archive/unarchive list",
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

	var users []models.User
	list := models.List{
		Id: uint(listId),
	}

	// find users who have access to list
	if err := database.DB.Model(&list).Association("Users").Find(&users); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding users in list",
		})
	}

	// check if current user is in the list
	for _, user := range users {
		// if in the list, archive the list
		if user.Id == userId {
			database.DB.Model(&user).Association("Lists").Delete(&list) // remove association
			database.DB.Delete(&list) // delete from database
			return c.JSON(fiber.Map{
				"message": "success",
			})
		}
	}

	// else return error
	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"message": "unauthorized to delete list",
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

	params := &UpdateListParam{}
	if err := c.BodyParser(params); err != nil {
		return err
	}

	var users []models.User
	list := models.List{
		Id: uint(listId),
	}

	// find users who have access to list
	if err := database.DB.Model(&list).Association("Users").Find(&users); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding users in list",
		})
	}

	// check if current user is in the list
	for _, user := range users {
		if user.Id == userId {
			// once user is in the list, find list object and update each
			// field accordingly
			database.DB.First(&list)
			if params.Title != "" {
				list.Title = params.Title
			}
			if len(params.Tasks) > 0 {
				var tasks []models.Task

				database.DB.Where("id IN ?", params.Tasks).Find(&tasks)
				list.Tasks = tasks
			}
			if len(params.Users) > 0 {
				var users []models.User

				database.DB.Where("id IN ?", params.Users).Find(&users)
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
	}
	// else return error
	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"message": "unauthorized to update list",
	})
}
