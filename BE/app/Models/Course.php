<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'no_of_students'];
    protected $table = 'course';

    public function students() {
      return $this->hasMany(User::class, 'course_id');
    }
}
