export default {
	data() {
		return {
			demographicSurvey: JSON.stringify({
				demographic: true,
				questions: [
					{
						id: 1,
						label: 'Hány éves vagy?',
						type: 'number',
					},
					{
						id: 2,
						label: 'Nemed:',
						type: 'radiogroup',
						options: ['Férfi', 'Nő'],
					},
					{
						id: 3,
						label: 'Melyik szomszédságban élsz?',
						type: 'dropdown',
						options: ['Budapest', 'Vidék'],
					},
					{
						id: 4,
						label: 'E-mail cím',
						type: 'text',
					},
					{
						id: 5,
						label: 'Bármi hozzáfűznivaló:',
						type: 'text',
					},
				],
			})
		};
	}
};
