package models

import "time"

type Label struct {
	Id        uint      `gorm:"primarykey" json:"id"`
	Name      string    `json:"name"`
	Deleted   bool      `gorm:"default:false" json:"deleted"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
	Tasks     []Task    `gorm:"many2many:task_label" json:"tasks"`
}