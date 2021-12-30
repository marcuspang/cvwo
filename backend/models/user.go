package models

import "time"

type User struct {
	Id        uint      `gorm:"primarykey" json:"id"`
	Username  string    `json:"username"`
	Email     string    `gorm:"unique" json:"email"`
	Password  []byte    `json:"-"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
	Lists     []List    `gorm:"many2many:user_list" json:"-"`
}
