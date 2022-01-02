package routes

import (
	"cvwo/controllers"
	"cvwo/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupUserRoutes(app fiber.Router) {
	app.Post("/login", controllers.Login)
	app.Post("/logout", controllers.Logout)
	app.Get("/current", middleware.Protected, controllers.Current)
	app.Post("/", controllers.Register)
	app.Get("/:id", controllers.GetUser)
	app.Patch("/:id", middleware.Protected, controllers.UpdateUser)
	app.Delete("/:id", middleware.Protected, controllers.DeleteUser)
}
