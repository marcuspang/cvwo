package controllers

import (
	"cvwo/database"
	"cvwo/models"
	"cvwo/util"

	"github.com/gofiber/fiber/v2"
)

type GetTasksQuery struct {
	ListId int `query:"listId"`
}

type AddTaskParam struct {
	Name      string `json:"name" xml:"name" form:"name"`
	StartDate string `json:"startDate" xml:"startDate" form:"startDate"` // in ISO format
	DueDate   string `json:"dueDate" xml:"dueDate" form:"dueDate"`       // in ISO format
	ListId    int    `json:"listId" xml:"listId" form:"listId"`
}

type UpdateTaskParam struct {
	Id   int  `json:"id" xml:"id" form:"id"`
	Done bool `json:"done" xml:"done" form:"done"`
	AddTaskParam
}

func GetTasks(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)

	queries := &GetTasksQuery{}
	if err := c.QueryParser(queries); err != nil {
		return err
	}

	// get users associated with listId given
	var users []models.User
	if err := database.DB.Find(&models.List{Id: uint(queries.ListId)}).Association("Users").Find(&users); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "no users associated with list",
		})
	}

	// only return task if user is in list.Users
	for _, user := range users {
		if user.Id == userId {
			var tasks []models.Task
			// return error if any
			if err := database.DB.Model(&models.List{Id: uint(queries.ListId)}).Association("Tasks").Find(&tasks); err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"message": err.Error(),
				})
			}
			// success
			return c.JSON(tasks)
		}
	}
	// else not authorized to view tasks
	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
		"message": "unauthorized to view tasks",
	})
}

func AddTask(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)

	params := &AddTaskParam{}
	if err := c.BodyParser(&params); err != nil {
		return err
	}

	// get users associated with listId given
	var users []models.User
	if err := database.DB.Find(&models.List{Id: uint(params.ListId)}).Association("Users").Find(&users); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "no users associated with list",
		})
	}

	// only add task if user is in list.Users
	for _, user := range users {
		if user.Id == userId {
			// date from frontend must be converted to ISOString before sending to backend
			task := models.Task{
				Name:      params.Name,
				StartDate: util.FormatJSDate(params.StartDate),
				DueDate:   util.FormatJSDate(params.DueDate),
				Done:      false,
				Deleted:   false,
				ListId:    uint(params.ListId),
			}

			if err := database.DB.Create(&task).Error; err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"message": err.Error(),
				})
			}
			// success
			return c.JSON(task)
		}
	}
	// not authorized to create
	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
		"message": "unauthorized to create task",
	})
}

func UpdateTask(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)

	params := &UpdateTaskParam{}
	if err := c.BodyParser(&params); err != nil {
		return err
	}

	// get users associated with listId given
	var users []models.User
	if err := database.DB.Find(&models.List{Id: uint(params.ListId)}).Association("Users").Find(&users); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "no users associated with list",
		})
	}

	// only update task if user is in list.Users
	for _, user := range users {
		if user.Id == userId {
			task := models.Task{
				Id:     uint(params.Id),
				Done:   params.Done,
				ListId: uint(params.ListId),
			}
			database.DB.First(&task)

			// success
			return c.JSON(task)
		}
	}
	// not authorized to create
	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
		"message": "unauthorized to create task",
	})
}
