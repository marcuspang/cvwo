package blog

import (
	"database/sql"
	"net/http"

	"cvwo/app"

	"github.com/uptrace/bunrouter"
)

type TagHandler struct {
	app *app.App
}

func NewTagHandler(app *app.App) TagHandler {
	return TagHandler{
		app: app,
	}
}

func (h TagHandler) List(w http.ResponseWriter, req bunrouter.Request) error {
	ctx := req.Context()

	tags := make([]string, 0)
	if err := h.app.DB().NewSelect().
		Model((*ArticleTag)(nil)).
		ColumnExpr("tag").
		GroupExpr("tag").
		OrderExpr("count(tag) DESC").
		Scan(ctx, &tags); err != nil && err != sql.ErrNoRows {
		return err
	}

	return bunrouter.JSON(w, bunrouter.H{
		"tags": tags,
	})
}
