package controllers

import (
	"cvwo/database"
	"cvwo/models"
	"cvwo/util"

	"github.com/gofiber/fiber/v2"
)

type ArchiveQuery struct {
	Id     int  `query:"id"`
	Delete bool `query:"delete"`
}

type UnarchiveQuery struct {
	Id int `query:"id"`
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
func GetUserLists(c *fiber.Ctx) error {
	userId, err := util.CurrentUserId(c)
	if err != nil {
		return c.JSON(err)
	}
	var lists []models.List

	database.DB.Model(&models.User{Id: userId}).Association("Lists").Find(&lists)
	return c.JSON(lists)
}

func AddList(c *fiber.Ctx) error {
	userId, err := util.CurrentUserId(c)
	if err != nil {
		return c.JSON(err)
	}

	data := new(AddListParam)
	if err := c.BodyParser(&data); err != nil {
		return err
	}

	// store user information into user then create list
	var user models.User
	database.DB.First(&user, userId)

	list := models.List{
		Title:   data.Title,
		Deleted: false,
		Tasks:   nil,
		Users:   []models.User{user},
	}

	database.DB.Create(&list)
	return c.JSON(list)
}

func ArchiveList(c *fiber.Ctx) error {
	userId, err := util.CurrentUserId(c)
	if err != nil {
		return c.JSON(err)
	}
	// check whether listId exists
	queries := new(ArchiveQuery)
	if err := c.QueryParser(queries); err != nil {
		return err
	}

	var users []models.User
	list := models.List{
		Id: uint(queries.Id),
	}

	// find users who have access to list
	database.DB.Model(&list).Association("Users").Find(&users)

	// check if current user is in the list
	for _, user := range users {
		// if in the list, archive the list
		if user.Id == userId {
			if queries.Delete {
				// remove association then delete the list object
				database.DB.Model(&user).Association("Lists").Delete(&list)
				database.DB.Delete(&list)
			} else {
				database.DB.Model(&list).Update("deleted", true)
			}
			return c.JSON(fiber.Map{
				"message": "success",
			})
		}
	}

	// else return error
	c.Status(fiber.StatusUnauthorized)
	return c.JSON(fiber.Map{
		"message": "list does not contain user",
	})
}

// TODO research whether they should be combined into one handler
// almost identical to archiveList functionality
func UnarchiveList(c *fiber.Ctx) error {
	userId, err := util.CurrentUserId(c)
	if err != nil {
		return c.JSON(err)
	}
	// check whether listId exists
	query := new(UnarchiveQuery)
	if err := c.QueryParser(query); err != nil {
		return err
	}

	var users []models.User
	list := models.List{
		Id: uint(query.Id),
	}

	// find users who have access to list
	database.DB.Model(&list).Association("Users").Find(&users)

	// check if current user is in the list
	for _, user := range users {
		// if in the list, unarchive the list
		if user.Id == userId {
			database.DB.Model(&list).Update("deleted", false)
			return c.JSON(fiber.Map{
				"message": "success",
			})
		}
	}

	// else return error
	c.Status(fiber.StatusUnauthorized)
	return c.JSON(fiber.Map{
		"message": "list does not contain user",
	})
}

func UpdateList(c *fiber.Ctx) error {
	userId, err := util.CurrentUserId(c)
	if err != nil {
		return c.JSON(err)
	}
	// check whether listId exists
	query := new(UpdateListParam)
	if err := c.BodyParser(query); err != nil {
		return err
	}

	var users []models.User
	list := models.List{
		Id: uint(query.Id),
	}

	// find users who have access to list
	database.DB.Model(&list).Association("Users").Find(&users)

	// check if current user is in the list
	for _, user := range users {
		if user.Id == userId {
			// once user is in the list, find list object and update each
			// field accordingly
			database.DB.First(&list)
			if query.Title != "" {
				list.Title = query.Title
			}
			if len(query.Tasks) > 0 {
				var tasks []models.Task

				database.DB.Where("id IN ?", query.Tasks).Find(&tasks)
				list.Tasks = tasks
			}
			if len(query.Users) > 0 {
				var users []models.User

				database.DB.Where("id IN ?", query.Users).Find(&users)
				list.Users = users
			}
			database.DB.Save(&list)
			return c.JSON(list)
		}
	}
	// else return error
	c.Status(fiber.StatusUnauthorized)
	return c.JSON(fiber.Map{
		"message": "list does not contain user",
	})
}
