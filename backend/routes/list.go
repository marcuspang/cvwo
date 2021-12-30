package routes

import (
	"cvwo/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupListRoutes(app *fiber.App) {
	app.Get("/list", controllers.GetUserLists)
	app.Post("/list/create", controllers.AddList)
	app.Patch("/list/update", controllers.UpdateList)
	app.Get("/list/archive", controllers.ArchiveList)
	app.Get("/list/unarchive", controllers.UnarchiveList)
}
