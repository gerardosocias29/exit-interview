<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function register(Request $request) {
      $fields = $request->validate([
        'name' => 'required|string',
        'email' => 'required|string|unique:users,email',
        'course' => 'required|string'
      ]);

      $user = User::create([
        'name' => $fields['name'],
        'email' => $fields['email'],
        'course' => $fields['course'],
        'birthdate' => $request->input('birthdate'),
        'contact' => $request->input('contact'),
        'address' => $request->input('address'),
        'mother' => $request->input('mother'),
        'father' => $request->input('father'),
        'spouse' => $request->input('spouse'),
        'children' => $request->input('children'),
        'messenger' => $request->input('messenger'),
        'password' => bcrypt('1234'),
        'isAdmin' => false,
        'course_id' => $request->input('course_id'),
      ]);

      $token = $user->createToken('uniquetoken')->plainTextToken;

      $response = [
        'user' => $user,
        'token' => $token
      ];

      return response($response, 201);
    }

    public function updateAdmin(Request $request) {

      $user = User::where('email', $request->input('email'))->first();

      $user->name = $request->input('name');
      $user->birthdate = $request->input('birthdate');
      $user->contact = $request->input('contact');
      $user->address = $request->input('address');
      $user->messenger = $request->input('messenger');

      $user->save();

      $response = [
        'user' => $user
      ];

      return response($response, 201);
    }

    public function login(Request $request) {
      $fields = $request->validate([
        'email' => 'required',
        'password' => 'required'
      ]);

      $user = User::where('email', $fields['email'])->first();

      if(!$user || !Hash::check($fields['password'], $user->password)) {
        return response([
          'message' => 'Email or password do not match'
        ], 400);
      } else {
        $token = $user->createToken('uniquetoken')->plainTextToken;

        return response([
          'user' => $user,
          'token' => $token
        ], 200);

      }
    }

    public function show(Request $request) {
      $keyword = request()->query('keyword', '');
      $users = User::whereNot('isAdmin', 1)->get();

      if($keyword) {
        $users = User::whereNot('isAdmin', 1)->where('name', 'like', '%'.$keyword.'%')->orWhere('course', 'like', '%'.$keyword.'%')->orWhere('address', 'like', '%'.$keyword.'%')->get();
      }
      return response($users);
    }

    public function logout(Request $request) {
      auth()->user()->tokens()->delete();
      return [
        'message' => 'Logged out'
      ];
    }
}