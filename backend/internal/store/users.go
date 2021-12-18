package store

import (
	"errors"
	"time"

	"github.com/uptrace/bun"
)

// TODO: add checks for user
type User struct {
	bun.BaseModel `bun:"table:users,alias:u"`

	ID        int64     `bun:"id,pk,autoincrement"`
	Username  string    `bun:"username,notnull"`
	Password  string    `bun:"password,notnull"`
	CreatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp"`
	UpdatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp"`
}

func AddUser(user *User) error {
	_, err := db.NewInsert().Model(user).Exec()
	if err != nil {
		return err
	}
	return nil
}

func Authenticate(username, password string) (*User, error) {
	user := new(User)
	if err := db.Model(user).Where(
		"username = ?", username).Select(); err != nil {
		return nil, err
	}
	if password != user.Password {
		return nil, errors.New("Password not valid.")
	}
	return user, nil
}
