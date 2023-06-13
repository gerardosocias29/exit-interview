<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;

class DashboardController extends Controller
{
    public function index(Request $request){
        // $sql = "SELECT f.name AS form_name, r.recommendation_option, r.recommendation_percentage, r.user_count
        //     FROM forms f
        //     LEFT JOIN (
        //     SELECT f.id AS form_id, o.name AS recommendation_option,
        //         CONCAT(FORMAT((COUNT(a.id) / (SELECT COUNT(*) FROM answers WHERE question_id = a.question_id AND user_form_id = a.user_form_id)) * 100, 2), '%') AS recommendation_percentage,
        //         COUNT(DISTINCT a.user_form_id) AS user_count,
        //         ROW_NUMBER() OVER (PARTITION BY f.id ORDER BY COUNT(a.id) DESC) AS rn
        //     FROM forms f
        //     JOIN questions q ON q.form_id = f.id
        //     JOIN answers a ON a.question_id = q.id
        //     JOIN options o ON o.id = a.option_id
        //     WHERE o.type = 'recommendations'
        //     GROUP BY f.id, o.id, a.question_id, a.user_form_id
        //     HAVING recommendation_percentage IS NOT NULL
        //     ) r ON r.form_id = f.id AND r.rn <= 3
        //     GROUP BY f.id, r.recommendation_option, r.recommendation_percentage, r.user_count
        //     ORDER BY f.id, r.recommendation_percentage DESC;
        // ";

        $sql_2 = "SELECT f.name AS form_name, r.option_id, r.recommendation_option,
                CONCAT(FORMAT((r.recommendation_count / t.total_questions) * 100, 2), '%') AS recommendation_percentage, r.user_count
            FROM forms f
            LEFT JOIN (
                SELECT f.id AS form_id, o.id AS option_id, o.name AS recommendation_option,
                    COUNT(DISTINCT a.id) AS recommendation_count, COUNT(DISTINCT a.user_form_id) AS user_count,
                    ROW_NUMBER() OVER (PARTITION BY f.id ORDER BY COUNT(DISTINCT a.id) DESC) AS rn
                FROM forms f
                JOIN questions q ON q.form_id = f.id
                JOIN answers a ON a.question_id = q.id
                JOIN options o ON o.id = a.option_id
                JOIN user_forms uf ON uf.form_id = f.id
                JOIN users u ON u.id = uf.user_id AND u.isAdmin = 0
                WHERE o.type = 'recommendations'
                GROUP BY f.id, o.id, o.name
            ) r ON r.form_id = f.id AND r.rn <= 3
            JOIN (
                SELECT f.id AS form_id, COUNT(q.id) AS total_questions
                FROM forms f
                JOIN questions q ON q.form_id = f.id
                GROUP BY f.id
            ) t ON t.form_id = f.id
            WHERE r.recommendation_option IS NOT NULL
            ORDER BY f.id, r.option_id, recommendation_percentage DESC;
        ";

        $dashboard_data = DB::select($sql_2);
        
        foreach ($dashboard_data as $row) {
            $formName = str_replace(' ', '_', $row->form_name);
            $recommendationOption = $row->recommendation_option;
            $recommendationPercentage = $row->recommendation_percentage;
        
            if (isset($formRecommendations[$formName])) {
                $formRecommendations[$formName]['datasets'][0]['data'][] = (float)$recommendationPercentage;
                $formRecommendations[$formName]['labels'][] = $recommendationOption;
            } else {
                $formRecommendations[$formName] = array(
                    'datasets' => array(
                        array(
                            'label' => 'recommendation',
                            'data' => array((float)$recommendationPercentage),
                            'backgroundColor' => '#3344ff',
                        ),
                    ),
                    'labels' => array($recommendationOption),
                );
            }
        }

        return response()->json($formRecommendations);
    }
}
