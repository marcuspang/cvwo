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
	AddTaskParam
	Done   bool  `json:"done" xml:"done" form:"done"`       // TODO figure out passing optional data, Done must always be passed for now
	Labels []int `json:"labels" xml:"labels" form:"labels"` // list of task ids
}

func GetTasksFromListId(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)

	queries := &GetTasksQuery{}
	if err := c.QueryParser(queries); err != nil {
		return err
	}

	// get users associated with listId given
	var users []models.User
	if err := database.DB.Model(&models.List{Id: uint(queries.ListId)}).Association("Users").Find(&users); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding users in list",
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

// func GetTask(c *fiber.Ctx) error {
// 	userId := c.Locals("userId").(uint)
// 	taskId, err := c.ParamsInt("id")
// 	if err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
// 			"message": "bad input params",
// 		})
// 	}

// 	// get users associated with listId given
// 	var users []models.User
// 	if err := database.DB.Model(&models.List{Id: uint(queries.ListId)}).Association("Users").Find(&users); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
// 			"message": "error finding users in list",
// 		})
// 	}

// 	// only return task if user is in list.Users
// 	for _, user := range users {
// 		if user.Id == userId {
// 			var tasks []models.Task
// 			// return error if any
// 			if err := database.DB.Model(&models.List{Id: uint(queries.ListId)}).Association("Tasks").Find(&tasks); err != nil {
// 				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
// 					"message": err.Error(),
// 				})
// 			}
// 			// success
// 			return c.JSON(tasks)
// 		}
// 	}
// 	// else not authorized to view tasks
// 	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
// 		"message": "unauthorized to view tasks",
// 	})
// }

func AddTask(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)

	params := &AddTaskParam{}
	if err := c.BodyParser(&params); err != nil {
		return err
	}

	// get users associated with listId given
	var users []models.User
	if err := database.DB.Model(&models.List{Id: uint(params.ListId)}).Association("Users").Find(&users); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding users in list",
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
	taskId, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bad input params",
		})
	}

	params := &UpdateTaskParam{}
	if err := c.BodyParser(&params); err != nil {
		return err
	}

	// get users associated with listId given
	var users []models.User
	if err := database.DB.Model(&models.List{Id: uint(params.ListId)}).Association("Users").Find(&users); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding users in list",
		})
	}

	// only update task if user is in list.Users
	for _, user := range users {
		if user.Id == userId {
			var task models.Task

			database.DB.First(&task, taskId)

			task.Done = params.Done // always passed for now
			task.ListId = uint(params.ListId)
			if params.DueDate != "" {
				task.DueDate = util.FormatJSDate(params.DueDate)
			}
			if params.Name != "" {
				task.Name = params.Name
			}
			if params.StartDate != "" {
				task.StartDate = util.FormatJSDate(params.StartDate)
			}
			if len(params.Labels) > 0 {
				var labels []models.Label

				database.DB.Where("id IN ?", params.Labels).Find(&labels)
				task.Labels = labels
			}
			if err := database.DB.Save(&task).Error; err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"message": err.Error(),
				})
			}

			// success
			return c.JSON(task)
		}
	}
	// not authorized to update
	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
		"message": "unauthorized to update task",
	})
}

func DeleteTask(c *fiber.Ctx) error {
	// userId := c.Locals("userId").(uint)
	taskId, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bad input params",
		})
	}

	// get users associated with listId given
	// var users []models.User
	// if err := database.DB.Model(&models.List{Id: uint()}).Association("Users").Find(&users); err != nil {
	// 	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
	// 		"message": "error finding users in list",
	// 	})
	// }

	// // only update task if user is in list.Users
	// for _, user := range users {
	// 	if user.Id == userId {
	// 		// database.DB.Model(&models.List{Id: uint(taskId)}).Association("Tasks").Delete(&models.Task{Id: }) // remove association
	// 		database.DB.Delete(&models.Task{Id: uint(taskId)}) // delete from database
	// 		return c.JSON(fiber.Map{
	// 			"message": "success",
	// 		})
	// 	}
	// }
	database.DB.Delete(&models.Task{Id: uint(taskId)}) // delete from database
	return c.JSON(fiber.Map{
		"message": "success",
	})
	// not authorized to update
	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
		"message": "unauthorized to update task",
	})
}
