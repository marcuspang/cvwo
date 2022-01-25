package models

import "time"

type User struct {
	Id        uint      `gorm:"primarykey" json:"id"`
	Username  string    `json:"username"`
	Email     string    `gorm:"unique" json:"email"`
	Password  []byte    `json:"-"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"-"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"-"`
	Lists     []List    `gorm:"many2many:user_list" json:"-"`
	Labels    []Label   `json:"labels"`
}
