package routes

import (
	"cvwo/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupLabelRoutes(app fiber.Router) {
	app.Get("/current", controllers.GetUserLabels) // current user's labels
	app.Get("/", controllers.GetLabels)
	app.Get("/:id", controllers.GetLabel)
	app.Post("/", controllers.AddLabel)
	app.Put("/:labelId/:taskId/remove", controllers.RemoveLabel)
	app.Patch("/:id", controllers.UpdateLabel)
	app.Delete("/:id", controllers.DeleteLabel)
}
