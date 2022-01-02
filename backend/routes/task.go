package routes

import (
	"cvwo/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupTaskRoutes(app fiber.Router) {
	app.Get("/", controllers.GetTasksFromListId) // current user's tasks
	app.Get("/:id", controllers.GetTask)         // return task only if user has access
	app.Post("/", controllers.AddTask)
	app.Patch("/:id", controllers.UpdateTask)
	app.Delete("/:id", controllers.DeleteTask)
	app.Put("/:id/archive", controllers.ArchiveTask) // pass "archive=true" in body for archive
}
