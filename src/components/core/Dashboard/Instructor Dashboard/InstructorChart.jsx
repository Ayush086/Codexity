import React, { useState } from 'react'

import { Chart, registerables } from 'chart.js'
import { Pie, Doughnut } from 'react-chartjs-2'

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {

	const [currChart, setCurrChart] = useState('students');

	// to generate random colors
	function getRandomColor() {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	function getContrastingColor(color) {
		// Convert hex color to RGB
		const r = parseInt(color.slice(1, 3), 16);
		const g = parseInt(color.slice(3, 5), 16);
		const b = parseInt(color.slice(5, 7), 16);

		// Calculate the brightness (YIQ formula)
		const brightness = (r * 299 + g * 587 + b * 114) / 1000;

		// If brightness is higher, return a dark color, otherwise return a light color
		return brightness > 128 ? '#000000' : '#FFFFFF';
	}

	function generateColorCombinations(numCombinations) {
		const combinations = [];
		for (let i = 0; i < numCombinations; i++) {
			const color1 = getRandomColor();
			const color2 = getContrastingColor(color1);
			combinations.push([color1, color2]);
		}
		return combinations;
	}

	// const colorCombinations = generateColorCombinations();

	// chart creation data 
	// student data
	const studentData = {
		labels: courses.map((course) => course.courseName),
		datasets: [
			{
				data: courses.map((course) => course.totalStudentsEnrolled),
				backgroundColor: generateColorCombinations(courses.length),
			}
		]

	}

	// income data
	const incomeData = {
		labels: courses.map((course) => course.courseName),
		datasets: [
			{
				data: courses.map((course) => course.totalAmountGenerated),
				backgroundColor: generateColorCombinations(courses.length),
			}
		]
	}

	// options
	const options = {

	};

	return (
		<div className='text-richblack-25'>

			<p>Analyse</p>
			{/* toggle */}
			<div>
				<button onClick={() => setCurrChart('students')}>
					Student
				</button>
				<button onClick={() => setCurrChart('income')}>
					Income
				</button>
			</div>

			<div>
				<Doughnut 
					data={currChart === 'students' ? studentData : incomeData}
					options={options}
				/>
			</div>

		</div>
	)
}

export default InstructorChart
