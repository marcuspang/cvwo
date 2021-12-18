package server

import (
	"cvwo/backend/internal/store"
	"net/http"

	"github.com/gin-gonic/gin"
)

func signUp(ctx *gin.Context) {
	user := new(store.User)

	// try and bind form data type to user type
	if err := ctx.Bind(user); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	store.Users = append(store.Users, user)
	ctx.JSON(http.StatusOK, gin.H{
		"msg": "Signed up successfully",
		"jwt": "12830981238",
	})
}
func signIn(ctx *gin.Context) {

	user := new(store.User)

	// try and bind form data type to user type
	if err := ctx.Bind(user); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	for _, u := range store.Users {
		if u.Username == user.Username && u.Password == user.Password {
			ctx.JSON(http.StatusOK, gin.H{
				"msg": "Signed in successfully",
				"jwt": "12830981238",
			})
			return
		}
	}
	ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": "Sign In Failed"})
}
