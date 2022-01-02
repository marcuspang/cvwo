package routes

import (
	"cvwo/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupListRoutes(app fiber.Router) {
	app.Get("/", controllers.GetLists) // current user's lists
	app.Post("/", controllers.AddList)
	app.Patch("/:id", controllers.UpdateList)
	app.Delete("/:id", controllers.DeleteList)
	app.Put("/:id/archive", controllers.ArchiveList) // pass "archive=true" in body for archive
}
