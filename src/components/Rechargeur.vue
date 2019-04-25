<template>


	<v-container style="background-color:black;">

		<v-img style="margin-top:68px;" src="/static/img/flashtrottnuit-logo.jpg"></v-img>
		<div class="display-1 mt-4 white--text">Devenez un Flashtrotter !</div>
		<div class="headline white--text mb-2">Et obtenez une source de revenus complétementaires.</div>

		<v-layout row wrap>

			<v-flex xs12>
				<v-text-field
				label="Nom"
				color="white"
				dark
				></v-text-field>
			</v-flex>

				<v-flex xs12>
				<v-text-field
				label="Prénom"
				color="white"
				dark
				></v-text-field>
			</v-flex>

				<v-flex xs12>
				<v-text-field
				label="Adresse"
				color="white"
				dark
				></v-text-field>
			</v-flex>

				<v-flex xs12>
				<v-text-field
				label="Mobile"
				color="white"
				dark
				></v-text-field>
			</v-flex>

				<v-flex xs12>
				<v-text-field
				label="Email"
				color="white"
				dark
				></v-text-field>
			</v-flex>

			<v-btn color="white">VALIDER MA DEMANDE</v-btn>

		</v-layout>

	</v-container>

</template>

<script>
	export default {

		name: 'Rechargeur',

		data () {
			return {

			}
		}
	}
</script>

<style lang="css" scoped>
/** {
	color: white !important;
}*/
</style>