package models

import "time"

type Task struct {
	Id        uint      `gorm:"primarykey" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	StartDate time.Time `json:"startDate"`
	DueDate   time.Time `json:"dueDate"`
	Done      bool      `gorm:"default:false" json:"done"`
	Archived  bool      `gorm:"default:false" json:"deleted"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"-"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"-"`
	ListId    uint      `gorm:"not null" json:"listId"`
	Labels    []Label   `gorm:"many2many:task_label" json:"-"`
}
