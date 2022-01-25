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

type AddTaskBody struct {
	Name      string `json:"name" xml:"name" form:"name"`
	StartDate string `json:"startDate" xml:"startDate" form:"startDate"` // in ISO format
	DueDate   string `json:"dueDate" xml:"dueDate" form:"dueDate"`       // in ISO format
	ListId    int    `json:"listId" xml:"listId" form:"listId"`
}

type UpdateTaskParam struct {
	AddTaskBody
	Done   bool  `json:"done" xml:"done" form:"done"`       // TODO figure out passing optional data, Done must always be passed for now
	Labels []int `json:"labels" xml:"labels" form:"labels"` // list of task ids
}

func GetTasksFromListId(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)

	var queries GetTasksQuery
	if err := c.QueryParser(&queries); err != nil {
		return err
	}

	// get user associated with listId given
	if err := database.DB.Model(&models.List{Id: uint(queries.ListId)}).Association("Users").Find(&models.User{Id: userId}); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding user in list",
		})
	}

	// only return task if user is in list.Users
	var tasks []models.Task
	// return error if any
	if err := database.DB.Order("id").Model(&models.List{Id: uint(queries.ListId)}).Association("Tasks").Find(&tasks); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}
	return c.JSON(tasks)
}

func GetTask(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)
	taskId, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bad input params",
		})
	}

	var task models.Task
	if err := database.DB.Find(&task, taskId).Error; err != nil || task.Id == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "task not found",
		})
	}

	// find user associated with listId given
	if err := database.DB.Model(&models.List{Id: task.ListId}).Association("Users").Find(&models.User{Id: userId}); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding user in list",
		})
	}

	// only return task if user is in list.Users
	return c.JSON(task)
}

func AddTask(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)

	var body AddTaskBody
	if err := c.BodyParser(&body); err != nil {
		return err
	}

	// get users associated with listId given
	if err := database.DB.Model(&models.List{Id: uint(body.ListId)}).Association("Users").Find(&models.User{Id: userId}); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding user in list",
		})
	}

	// only add task if user is in list.Users
	// date from frontend must be converted to ISOString before sending to backend
	task := models.Task{
		Name:      body.Name,
		StartDate: util.FormatJSDate(body.StartDate),
		DueDate:   util.FormatJSDate(body.DueDate),
		Done:      false,
		Archived:  false,
		ListId:    uint(body.ListId),
	}

	if err := database.DB.Create(&task).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}
	return c.JSON(task)
}

func UpdateTask(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)
	taskId, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bad input params",
		})
	}

	var body UpdateTaskParam
	if err := c.BodyParser(&body); err != nil {
		return err
	}

	// get users associated with listId given
	if err := database.DB.Model(&models.List{Id: uint(body.ListId)}).Association("Users").Find(&models.User{Id: userId}); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding user in list",
		})
	}

	// only update task if user is in list.Users
	var task models.Task

	if err := database.DB.First(&task, taskId).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "task not found",
		})
	}

	task.Done = body.Done
	task.ListId = uint(body.ListId)
	task.DueDate = util.FormatJSDate(body.DueDate)
	task.Name = body.Name
	task.StartDate = util.FormatJSDate(body.StartDate)
	if len(body.Labels) > 0 {
		var labels []models.Label

		database.DB.Where("id IN ?", body.Labels).Find(&labels)
		task.Labels = labels
	} else {
		task.Labels = nil
	}
	if err := database.DB.Save(&task).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// success
	return c.JSON(task)
}

func DeleteTask(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)
	taskId, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bad input params",
		})
	}

	var task models.Task
	if err := database.DB.Find(&task, taskId).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "no task found",
		})
	}

	// get users associated with listId of task
	if err := database.DB.Model(&models.List{Id: task.ListId}).Association("Users").Find(&models.User{Id: userId}); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding user in list",
		})
	}

	// only update task if user is in list.Users
	if err := database.DB.Delete(&task).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error deleting task",
		})
	}
	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func ArchiveTask(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)
	taskId, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bad input params",
		})
	}

	var body ArchiveBody
	if err := c.BodyParser(&body); err != nil {
		return err
	}

	var task models.Task
	if err := database.DB.Find(&task, taskId).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "no task found",
		})
	}

	// get user associated with listId of task
	if err := database.DB.Model(&models.List{Id: task.ListId}).Association("Users").Find(&models.User{Id: userId}); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding user in list",
		})
	}

	task.Archived = body.Archive
	if err := database.DB.Save(&task).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error deleting task",
		})
	}
	return c.JSON(fiber.Map{
		"message": "success",
	})
}
