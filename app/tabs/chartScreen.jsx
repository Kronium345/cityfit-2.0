import React from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import tw from 'twrnc';

const screenWidth = Dimensions.get('window').width;

const ChartScreen = () => {
  // Sample data for charts
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        strokeWidth: 2, // optional
      },
    ],
  };

  const barChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        data: [50, 60, 70, 80],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  return (
    <ScrollView style={tw`flex-1 bg-gray-100 p-6`}>
      <Text style={tw`text-3xl font-bold mb-2`}>Progress Charts</Text>
      <Text style={tw`text-lg mb-8`}>Track your progress over time!</Text>

      <Text style={tw`text-lg font-bold mb-4`}>Weight Progress</Text>
      <LineChart
        data={lineChartData}
        width={screenWidth - 40} // from react-native
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      <Text style={tw`text-lg font-bold mb-4 mt-8`}>Workout Progress</Text>
      <BarChart
        data={barChartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </ScrollView>
  );
};

export default ChartScreen;
