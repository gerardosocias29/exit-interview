<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CourseController extends Controller
{
    public function index() {
      $c = Course::all();
      return response($c);
    }

    public function course_stats(Request $request, $course) {
      $course = Course::where('name', 'like', "%$course%")->first();
      $users = User::where('course_id', $course->id)->count();
      $percentage = ($users / $course->no_of_students) * 100;
      $formattedPercentage = number_format($percentage, 2);
      return response()->json([
        "percentage" => $formattedPercentage,
        "totalResponded" => $users,
        "courseRespondents" => $course->no_of_students
      ]);
    }
  

    public function register(Request $request) {
      $fields = $request->validate([
        'name' => 'required|string',
        'no_of_students' => 'required|int'
      ]);

      $c = Course::create([
        'name' => $fields['name'],
        'no_of_students' => $fields['no_of_students']
      ]);

      return response($c, 201);
    }

    public function update(Request $request) {
      $fields = $request->validate([
        'id' => 'required|int',
        'name' => 'required|string',
        'no_of_students' => 'required|int'
      ]);

      $course = Course::find($fields['id']); // Assuming your model is named 'Course' and 'id' 1 exists

      if ($course) {
        $course->update([
          'name' => $fields['name'],
          'no_of_students' => $fields['no_of_students']
        ]);
      }

      return response(["status" => "ok"], 200);
    }
}
