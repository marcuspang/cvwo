package models

import "time"

type List struct {
	Id        uint      `gorm:"primarykey" json:"id"`
	Title     string    `json:"title"`
	Archived  bool      `gorm:"default:false" json:"archived"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
	Users     []User    `gorm:"many2many:user_list" json:"users"`
	Tasks     []Task    `json:"tasks"`
}
