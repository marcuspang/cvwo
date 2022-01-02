package routes

import (
	"cvwo/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupListRoutes(app fiber.Router) {
	app.Get("/", controllers.GetLists)
	app.Post("/create", controllers.AddList)
	app.Patch("/update", controllers.UpdateList)
	app.Post("/archive", controllers.ArchiveList) // pass "delete=true" in query for delete
	app.Post("/unarchive", controllers.UnarchiveList)
}
