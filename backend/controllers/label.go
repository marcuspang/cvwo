package controllers

import (
	"cvwo/database"
	"cvwo/models"

	"github.com/gofiber/fiber/v2"
)

type AddLabelBody struct {
	Name  string `json:"name" xml:"name" form:"name"`
	Tasks []int  `json:"tasks" xml:"tasks" form:"tasks"` // list of task ids
}

type UpdateLabelBody struct {
	Name  string `json:"name" xml:"name" form:"name"`
	Tasks []int  `json:"tasks" xml:"tasks" form:"tasks"` // list of task ids
}

type RemoveLabelBody struct {
	Remove bool `json:"remove" xml:"remove" form:"remove"`
}

func GetUserLabels(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)
	var labels []models.Label

	if err := database.DB.Where("user_id = ?", userId).Find(&labels).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.JSON(labels)
}

func GetLabels(c *fiber.Ctx) error {
	var labels []models.Label
	if err := database.DB.Find(&labels).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "labels not found",
		})
	}
	return c.JSON(labels)
}

func GetLabel(c *fiber.Ctx) error {
	labelId, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bad input params",
		})
	}

	label := models.Label{
		Id: uint(labelId),
	}

	if err := database.DB.Find(&label).Error; err != nil || label.UserId == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "label not found",
		})
	}

	return c.JSON(label)
}

func AddLabel(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)

	var body AddLabelBody
	if err := c.BodyParser(&body); err != nil {
		return err
	}

	var user models.User
	if err := database.DB.First(&user, userId).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "user not found",
		})
	}

	var tasks []models.Task
	if err := database.DB.Find(&tasks, body.Tasks).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "tasks not found",
		})
	}

	label := models.Label{
		Name:     body.Name,
		Archived: false,
		Tasks:    tasks,
		UserId:   userId,
	}

	if err := database.DB.Create(&label).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}
	return c.JSON(label)
}

func DeleteLabel(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)
	labelId, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bad input params",
		})
	}

	label := models.Label{Id: uint(labelId), UserId: userId}

	if err := database.DB.First(&label).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding label with associated user",
		})
	}

	if err := database.DB.Model(&models.User{Id: userId}).Association("Labels").Delete(&label); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error deleting association with user",
		})
	}

	if err := database.DB.Delete(&label).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error deleting label",
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func UpdateLabel(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)
	labelId, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bad input params",
		})
	}

	var body UpdateLabelBody
	if err := c.BodyParser(&body); err != nil {
		return err
	}

	label := models.Label{
		Id:     uint(labelId),
		UserId: userId,
	}

	if err := database.DB.First(&label).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding label with associated user",
		})
	}

	if body.Name != "" {
		label.Name = body.Name
	}
	if len(body.Tasks) > 0 {
		var tasks []models.Task

		database.DB.Where("id IN ?", body.Tasks).Find(&tasks)
		label.Tasks = tasks
	}
	if err := database.DB.Save(&label).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}
	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func RemoveLabel(c *fiber.Ctx) error {
	userId := c.Locals("userId").(uint)
	labelId, labelErr := c.ParamsInt("labelId")
	taskId, taskErr := c.ParamsInt("taskId")
	if taskErr != nil || labelErr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bad input params",
		})
	}

	var body RemoveLabelBody
	if err := c.BodyParser(&body); err != nil {
		return err
	}

	label := models.Label{Id: uint(labelId), UserId: userId}

	if err := database.DB.First(&label).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error finding associated user",
		})
	}
	// filter tasks for taskId
	i := 0
	for _, task := range label.Tasks {
		if task.Id != uint(taskId) {
			label.Tasks[i] = task
			i++
		}
	}
	label.Tasks = label.Tasks[:i]

	if err := database.DB.Save(&label).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error removing label",
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}
