<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Forms extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'form_course'];

    public function questions() {
      return $this->hasMany(Questions::class, 'form_id');
    }

    public function responses() {
      return $this->hasMany(UserForms::class, 'form_id');
    }
}
